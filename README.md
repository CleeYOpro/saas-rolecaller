# 🎒 RoleCaller

**Restoring Hope Where Paper Failed**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/cleeyopros-projects/v0-your-saa-s-saa-s-landing-page)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](#)

## 📌 About RoleCaller

RoleCaller is a revolutionary offline-first SaaS solution designed specifically for rural and remote schools. Our mission is to ensure that education doesn't depend on internet connectivity, providing teachers with powerful tools to track student attendance even in the most challenging environments.

RoleCaller empowers educators to capture attendance data anywhere—deep in forests, on hilltops, or in areas with no internet connectivity—and sync it seamlessly when connectivity becomes available.

---

## ✨ Key Features

- **📴 100% Offline Capability**: Teachers can mark attendance on their smartphones without any internet connection. All data is securely stored on the device until it can be synced.
- **☁️ Smart Sync**: When the internet becomes available, the app automatically syncs all saved data in the background without manual intervention.
- **⚡ Auto-Fill Attendance**: Saves teachers time by automatically marking the rest of the class as present once initial attendance is taken.
- **📊 Director & Teacher Dashboards**: Role-based access providing actionable, real-time insights, attendance patterns, and highlighting for at-risk students.
- **📈 Excel Reporting Export**: Directors can quickly generate and download comprehensive Excel reports containing multi-sheet daily attendance data and summaries.
- **👀 Every Child Seen**: Quietly tracks attendance patterns to easily identify students at risk of dropping out.
- **💝 Free Forever**: As an open-source initiative, RoleCaller is completely free for all schools. We believe every child deserves to be seen and counted.

---

## 🛠️ Technology Stack

RoleCaller is built with modern, performant web technologies:

- **Framework**: [Next.js 16](https://nextjs.org/) & [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Database**: PostgreSQL (via `pg`)
- **Authentication**: JWT (`jose`) & `bcryptjs`
- **Utilities**: `exceljs` (for Excel exports), `recharts` (for data visualization)
- **Deployment**: [Vercel](https://vercel.com)

---

## 🚀 How It Works

1. **Offline Attendance**: Teachers log into the mobile-responsive app to mark attendance, functioning perfectly in zero-connectivity areas.
2. **Local Storage**: Data is safely held in the browser's local storage or indexedDB until a connection is found.
3. **Background Syncing**: The moment connectivity is restored, the application quietly syncs the locally stored attendance data to the main PostgreSQL database.
4. **Actionable Insights**: School directors and administrators view clear, color-coded calendars and charts to monitor attendance and intervene when students are frequently absent.

---

## 💻 Local Development

Follow these steps to run the RoleCaller platform locally:

### 1. Clone the repository and install dependencies

We recommend using `npm` or `pnpm` for package management:

```bash
# Install dependencies
npm install
# or
pnpm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root of the project with the necessary database and authentication secrets. Ensure you have a running PostgreSQL instance.

```env
# Example .env (Add your actual credentials)
DATABASE_URL="postgresql://user:password@localhost:5432/rolecaller"
JWT_SECRET="your_secure_jwt_secret"
```

### 3. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deployment

This project is directly deployable to platforms supporting Next.js apps, such as Vercel. Any updates to the deployed branch will automatically push changes.

**Live Application:** [RoleCaller on Vercel](https://vercel.com/cleeyopros-projects/v0-your-saa-s-saa-s-landing-page)

---

## 🤝 Contributing

We welcome contributions! Whether it's squashing bugs, improving the offline sync logic, or designing new UI components, your help allows us to better serve rural educational communities.

---

## 📄 License

This project is open-source and free to use for educational institutions serving underprivileged communities.

*RoleCaller - Restoring Hope Where Paper Failed*