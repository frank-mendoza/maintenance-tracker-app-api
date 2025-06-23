import OverviewPage from "@/features/overview/OverviewPage";

export const metadata = {
  title: "Overview Dashboard | My Rental App",
  description:
    "View your properties, tenants, and recent maintenance activity in one place.",
  keywords: "rental properties, maintenance, tenants, property dashboard",
  authors: [{ name: "Your Name", url: "https://yourdomain.com" }],
  creator: "Your Name",
  openGraph: {
    title: "Overview Dashboard | My Rental App",
    description:
      "All-in-one dashboard for managing properties and maintenance logs.",
    url: "https://yourdomain.com/overview",
    siteName: "My Rental App",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Overview = () => {
  return <OverviewPage />;
};
export default Overview;
