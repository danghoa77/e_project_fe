import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useProductStore } from "@/store/productStore";
import { MAX_PRICE } from "@/pages/customer/products/constants";

const serviceLinks = [
  {
    href: "/find-a-store",
    label: "Find a store",
    icon: <MapPin className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />,
  },
  {
    href: "/profile",
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
  console.log(cartItemCount);
  const scrollDirection = useScroll();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const { user } = useAuthStore();

  const { category, setFilters } = useProductStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      setFilters({ search: searchQuery });
      navigate("/products");
    }
  };

  const handleClickCategory = (id: string) => {
    setFilters({
      category: id,
      price: { min: 0, max: MAX_PRICE },
      size: [],
      sortBy: "",
    });
    navigate("/products");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fcf7f1] backdrop-blur-sm">
      <div className="container mx-auto px-4">
        {/* Top section */}
        <div
          className={cn(
            "overflow-hidden transition-[height] duration-300",
            scrollDirection === "down" ? "h-0" : "h-24"
          )}
        >
          <div className="relative h-24">
            {/* Mobile search */}
            <div
              className={cn(
                "absolute inset-0 md:hidden px-4",
                isMobileSearchOpen ? "flex items-center" : "hidden"
              )}
            >
              <form
                className="flex items-center w-full px-4"
                onSubmit={handleSearch}
              >
                <Search className="h-5 w-5 text-neutral-500" />
                <input
                  type="search"
                  placeholder="Search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full px-2 bg-transparent border-0 border-b-2 border-neutral-400 focus:ring-0 focus:outline-none focus:border-neutral-800 hide-search-cancel-button"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </form>
            </div>

            {/* Main nav */}
            <div
              className={cn(
                "relative flex items-center justify-between h-full px-6",
                isMobileSearchOpen ? "hidden" : "flex"
              )}
            >
              <div className="flex items-center">
                {/* Mobile menu */}
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
                          {(category ?? []).map((cat) => (
                            <div
                              key={cat._id}
                              className="flex justify-between items-center py-3 border-b border-neutral-200"
                            >
                              <SheetClose asChild>
                                <button
                                  onClick={() => handleClickCategory(cat._id)}
                                  className="text-sm uppercase tracking-wider text-neutral-800 text-left w-full"
                                >
                                  {cat.name}
                                </button>
                              </SheetClose>

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

                        {/* Service links */}
                        <nav className="flex flex-col space-y-5 mt-10">
                          {serviceLinks.map((link) => (
                            <SheetClose asChild key={link.href}>
                              <Link
                                to={link.href}
                                className="flex items-center gap-4 text-sm text-neutral-700 hover:text-neutral-900 transition-colors"
                              >
                                {link.icon}
                                <span>{link.label}</span>
                              </Link>
                            </SheetClose>
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

                {/* Desktop search */}
                <form
                  className="hidden md:flex relative items-center"
                  onSubmit={handleSearch}
                >
                  <Search className="absolute left-0 h-5 w-5 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 border-0 border-b-2 border-neutral-300 rounded-none bg-transparent ring-0 shadow-none outline-none focus:ring-0 focus:outline-none focus:shadow-none focus:border-neutral-800"
                  />
                </form>
              </div>

              {/* Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link to="/" aria-label="Back to homepage">
                  <BrandLogo />
                </Link>
              </div>

              {/* Account & Cart */}
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
          <nav className="hidden md:flex justify-center items-center gap-6 uppercase tracking-wider py-5">
            {(category ?? []).map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleClickCategory(cat._id)}
                className="transition-colors font-sans font-medium text-[14px] leading-[16px] tracking-[1px] hover:text-neutral-900 pb-1 text-neutral-600"
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
