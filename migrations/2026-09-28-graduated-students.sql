-- Yearly grade promotion (app/api/promotions/route.ts).
--
-- Graduating students move out of `students` into `graduated_students`, keeping the same id.
-- Their attendance rows are never touched (same student_id, same class_id), so the
-- attendance -> students foreign key is replaced by triggers that accept either table.
-- The phone app keeps reading `students`/`classes` as before and never sees graduates.
--
-- NOTE: rolecaller-app/database/schema.ts still declares attendance.student_id -> students.id
-- and doesn't know these tables. Don't run `drizzle-kit push` from that repo without updating it.

BEGIN;

CREATE TABLE graduated_students (
  id uuid PRIMARY KEY,                       -- same id the student had in `students`
  school_id uuid NOT NULL REFERENCES schools(id),
  name text NOT NULL,
  grade text NOT NULL,
  number text,
  graduation_year integer NOT NULL,          -- stands in for the class once graduated
  created_at timestamp,                      -- copied from `students`
  graduated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX graduated_students_school_year_idx ON graduated_students (school_id, graduation_year);

-- One promotion per school per year, and a record of what each one moved
CREATE TABLE school_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id),
  year integer NOT NULL,
  promoted_count integer NOT NULL,
  graduated_count integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, year)
);

ALTER TABLE attendance DROP CONSTRAINT attendance_student_id_students_id_fk;

-- attendance.student_id must exist in students or graduated_students.
-- FOR KEY SHARE blocks a concurrent delete of that student, like the foreign key did.
CREATE FUNCTION attendance_student_exists() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM students WHERE id = NEW.student_id FOR KEY SHARE)
     AND NOT EXISTS (SELECT 1 FROM graduated_students WHERE id = NEW.student_id FOR KEY SHARE) THEN
    RAISE EXCEPTION 'attendance.student_id % is not in students or graduated_students', NEW.student_id
      USING ERRCODE = 'foreign_key_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attendance_student_exists
  BEFORE INSERT OR UPDATE OF student_id ON attendance
  FOR EACH ROW EXECUTE FUNCTION attendance_student_exists();

-- A student with attendance can only be deleted once they exist in the other table
-- (i.e. they were moved, not removed), matching what the foreign key used to allow.
CREATE FUNCTION keep_attendance_student() RETURNS trigger AS $$
DECLARE
  moved boolean;
BEGIN
  IF TG_TABLE_NAME = 'students' THEN
    moved := EXISTS (SELECT 1 FROM graduated_students WHERE id = OLD.id);
  ELSE
    moved := EXISTS (SELECT 1 FROM students WHERE id = OLD.id);
  END IF;

  IF NOT moved AND EXISTS (SELECT 1 FROM attendance WHERE student_id = OLD.id) THEN
    RAISE EXCEPTION 'student % still has attendance records', OLD.id
      USING ERRCODE = 'foreign_key_violation';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER students_keep_attendance
  BEFORE DELETE ON students
  FOR EACH ROW EXECUTE FUNCTION keep_attendance_student();

CREATE TRIGGER graduated_students_keep_attendance
  BEFORE DELETE ON graduated_students
  FOR EACH ROW EXECUTE FUNCTION keep_attendance_student();

COMMIT;

-- Rollback (only valid while graduated_students is empty; otherwise their attendance rows
-- would violate the restored foreign key):
--   DROP TRIGGER graduated_students_keep_attendance ON graduated_students;
--   DROP TRIGGER students_keep_attendance ON students;
--   DROP TRIGGER attendance_student_exists ON attendance;
--   DROP FUNCTION keep_attendance_student();
--   DROP FUNCTION attendance_student_exists();
--   ALTER TABLE attendance ADD CONSTRAINT attendance_student_id_students_id_fk
--     FOREIGN KEY (student_id) REFERENCES students(id);
--   DROP TABLE school_promotions;
--   DROP TABLE graduated_students;
