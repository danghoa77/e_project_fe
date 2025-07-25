// src/components/shared/Navbar.tsx
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/women", label: "Women" },
    { href: "/men", label: "Men" },
    { href: "/outdoor", label: "Outdoor and Equestrian" },
    { href: "/jewelry-watches", label: "Jewelry and Watches" },
    { href: "/fragrances-makeup", label: "Fragrances and Make-up" },
    { href: "/gifts", label: "Gifts and Petit H" },
    { href: "/about", label: "About BRAND" },
];

const BrandLogo = () => (
    <svg width="150" height="50" viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="bold">
            BRAND
        </text>
    </svg>
);

export const Navbar = () => {
    const scrollDirection = useScroll();

    return (
        <header className="sticky top-0 z-50 w-full bg-[#fcf7f1] backdrop-blur-sm ">
            <div className="container mx-auto px-4">
                <div
                    className={cn(
                        "overflow-hidden transition-[height] duration-300",
                        scrollDirection === 'down' ? "h-0" : "h-24"
                    )}
                >
                    <div className="grid grid-cols-4 md:grid-cols-3 items-center h-24">
                        <div className="flex items-center justify-start ml-7">
                            <div className="flex items-center gap-1 md:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Menu className="h-6 w-6" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px]">
                                        <nav className="flex flex-col space-y-6 mt-8">
                                            {navLinks.map((link) => (
                                                <NavLink
                                                    key={link.href}
                                                    to={link.href}
                                                    className={({ isActive }) =>
                                                        `text-lg transition-colors hover:text-neutral-900 ${isActive ? "font-semibold text-neutral-900" : "text-neutral-600"}`
                                                    }
                                                >
                                                    {link.label}
                                                </NavLink>
                                            ))}
                                        </nav>
                                    </SheetContent>
                                </Sheet>
                                <Button variant="ghost" size="icon">
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

                        <div className="col-span-2 md:col-span-1 md:col-start-2 flex justify-center">
                            <Link to="/" aria-label="Back to homepage"><BrandLogo /></Link>
                        </div>

                        <div className="col-start-4 md:col-start-3 flex items-center justify-end space-x-2 md:space-x-4 m-y-2 mr-7">
                            <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
                                <User className="h-7 w-7" strokeWidth={1} />
                                <span className="hidden md:inline text-sm">Account</span>
                            </Button>
                            <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
                                <ShoppingBag className="h-7 w-7" strokeWidth={1} />
                                <span className="hidden md:inline text-sm">Cart</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="w-1/3 border-t-1 border-neutral-900 mx-auto" />
                    <nav className="hidden md:flex justify-center items-center gap-6 uppercase tracking-wider py-6 ">
                        {navLinks.map((link) => (
                            <NavLink key={link.href} to={link.href} className={({ isActive }) => `transition-colors font-sans font-medium text-[14px] leading-[16px] tracking-[1px] hover:text-neutral-900 pb-1 ${isActive ? "text-neutral-900" : "text-neutral-600"}`}>{link.label}</NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};
