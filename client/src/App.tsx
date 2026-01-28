import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Testimonials from "./pages/Testimonials";
import Locations from "./pages/Locations";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTeachers from "./pages/AdminTeachers";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminLocations from "./pages/AdminLocations";
import AdminClasses from "./pages/AdminClasses";
import AdminSessions from "./pages/AdminSessions";
import AdminPages from "./pages/AdminPages";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Parties from "./pages/Parties";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/teachers"} component={Teachers} />
      <Route path={"/classes"} component={Classes} />
      <Route path={"/testimonials"} component={Testimonials} />
      <Route path={"/locations"} component={Locations} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/parties"} component={Parties} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin/teachers"} component={AdminTeachers} />
      <Route path={"/admin/testimonials"} component={AdminTestimonials} />
      <Route path={"/admin/locations"} component={AdminLocations} />
      <Route path={"/admin/classes"} component={AdminClasses} />
      <Route path={"/admin/sessions"} component={AdminSessions} />
      <Route path={"/admin/pages"} component={AdminPages} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
