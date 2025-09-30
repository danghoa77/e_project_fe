import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Plus,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import { CartSheet } from "../../pages/customer/cart/CartSheet";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { href: "/products/women", label: "Women" },
  { href: "/products/men", label: "Men" },
  {
    href: "/products/home-outdoor-and-equestrian",
    label: "Home, Outdoor and Equestrian",
  },
  { href: "/products/jewelry-watches", label: "Jewelry and Watches" },
  { href: "/products/fragrances-makeup", label: "Fragrances and Make-up" },
  { href: "/products/gifts-and-petit-h", label: "Gifts and Petit H" },
  {
    href: "/products/special-editions-and-services",
    label: "Special Editions and Services",
  },
  { href: "/about", label: "About BRAND" },
];

const serviceLinks = [
  {
    href: "/find-a-store",
    label: "Find a store",
    icon: <MapPin className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />,
  },
  {
    href: "/account",
    label: "Account",
    icon: <User className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />,
  },
  {
    href: "/contact-us",
    label: "Contact us",
    icon: (
      <MessageSquare className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
    ),
  },
];

const BrandLogo = () => (
  <svg viewBox="0 0 300 100" className="w-41 md:w-64 h-auto">
    <image
      href="https://res.cloudinary.com/dzskttedu/image/upload/v1753605066/Logo_Hismes_Italy_v%E1%BB%9Bi_xe_ng%E1%BB%B1aa1-removebg-preview_ngtmst.png"
      width="300"
      height="100"
      preserveAspectRatio="xMidYMid meet"
    />
  </svg>
);

export const Navbar = ({ cartItemCount }: { cartItemCount: number }) => {
  const scrollDirection = useScroll();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcf7f1] backdrop-blur-sm ">
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "overflow-hidden transition-[height] duration-300",
            scrollDirection === "down" ? "h-0" : "h-24"
          )}
        >
          <div className="relative h-24">
            <div
              className={cn(
                "absolute inset-0 md:hidden px-4",
                isMobileSearchOpen ? "flex items-center" : "hidden"
              )}
            >
              <div className="flex items-center w-full px-4">
                <Search className="h-5 w-5 text-neutral-500" />
                <input
                  type="search"
                  placeholder="Search"
                  autoFocus
                  className="w-full h-full px-2 bg-transparent border-0 border-b-2 border-neutral-400 focus:ring-0 focus:outline-none focus:border-neutral-800 hide-search-cancel-button"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <div
              className={cn(
                "relative flex items-center justify-between h-full px-6",
                isMobileSearchOpen ? "hidden" : "flex"
              )}
            >
              <div className="flex items-center">
                <div className="flex items-center gap-1 md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-full sm:max-w-sm p-0 bg-[#fcf7f1]"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                        <h2 className="text-lg font-medium">Menu</h2>
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon">
                            <X className="h-6 w-6" />
                          </Button>
                        </SheetClose>
                      </div>
                      <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
                        <nav className="flex flex-col">
                          {navLinks.map((link) => (
                            <div
                              key={link.href}
                              className="flex justify-between items-center py-3 border-b border-neutral-200"
                            >
                              <NavLink
                                to={link.href}
                                className="text-sm uppercase tracking-wider text-neutral-800"
                              >
                                {link.label}
                              </NavLink>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-neutral-500"
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                            </div>
                          ))}
                        </nav>
                        <nav className="flex flex-col space-y-5 mt-10">
                          {serviceLinks.map((link) => (
                            <Link
                              key={link.href}
                              to={link.href}
                              className="flex items-center gap-4 text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
                            >
                              {link.icon}
                              <span>{link.label}</span>
                            </Link>
                          ))}
                        </nav>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileSearchOpen(true)}
                  >
                    <Search className="h-6 w-6" strokeWidth={1.5} />
                  </Button>
                </div>

                <div className="hidden md:flex relative items-center">
                  <Search className="absolute left-0 h-5 w-5 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-full pl-7 border-0 border-b-2 border-neutral-300 rounded-none bg-transparent ring-0 shadow-none outline-none focus:ring-0 focus:outline-none focus:shadow-none focus:border-neutral-800"
                  />
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link to="/" aria-label="Back to homepage">
                  <BrandLogo />
                </Link>
              </div>

              <div className="flex items-center gap-x-3">
                <Button
                  asChild
                  variant="ghost"
                  className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                >
                  <Link to={user ? "/profile" : "/login"}>
                    <User className="h-7 w-7" strokeWidth={1} />
                    <span className="hidden md:inline text-sm">Account</span>
                  </Link>
                </Button>

                <CartSheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                    >
                      <div className="relative">
                        <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
                        <span className="absolute -top-2 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                          {cartItemCount > 99 ? "99+" : cartItemCount}
                        </span>
                      </div>
                      <span className="hidden md:inline text-sm">Cart</span>
                    </Button>
                  </SheetTrigger>
                </CartSheet>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="w-1/3 border-t border-neutral-900 mx-auto" />
          <nav className="hidden md:flex justify-center items-center gap-6 uppercase tracking-wider py-5 ">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `transition-colors font-sans font-medium text-[14px] leading-[16px] tracking-[1px] hover:text-neutral-900 pb-1 ${
                    isActive ? "text-neutral-900" : "text-neutral-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
