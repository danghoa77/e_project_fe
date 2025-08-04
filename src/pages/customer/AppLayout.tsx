
export const AppLayout = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="max-w-screen-2xl mx-auto bg-white shadow-sm">
      <Navbar />
      <main>
        <AuthLoader>
          <Outlet />
        </AuthLoader>
      </main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};