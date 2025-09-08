const DashboardPage = () => {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-3 gap-8">
        {/* main content area for the calendar */}
        <div className="col-span-2 rounded-lg bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Calendar View</h2>
          <div className="h-96 rounded-md bg-background">
            {/* placeholder for calendar */}
          </div>
        </div>

        {/* sidebar for upcoming tasks */}
        <div className="col-span-1 rounded-lg bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Upcoming Tasks</h2>
          <div className="space-y-4">
            {/* placeholder for task items */}
            <div className="rounded-md bg-background p-4">
              <p className="font-semibold">Research Paper</p>
              <p className="text-sm text-muted-foreground">Due: September 15, 2025</p>
            </div>
            <div className="rounded-md bg-background p-4">
              <p className="font-semibold">Quiz 3</p>
              <p className="text-sm text-muted-foreground">Due: September 10, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;