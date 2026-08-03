import DashboardPageContent from "@/features/Dashboard/DashboardPageContent";

interface PageProps {
  params: {
    id: string;
  };
}

const page = ({ params }: PageProps) => {
  return <DashboardPageContent editBookId={params.id} />;
};

export default page;
