// src/components/shared/Navbar.tsx
import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Menu, Search, ShoppingBag, User, X, Plus, MapPin, MessageSquare } from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/women", label: "Women" },
    { href: "/men", label: "Men" },
    { href: "/outdoor", label: "Home, Outdoor and Equestrian" },
    { href: "/jewelry-watches", label: "Jewelry and Watches" },
    { href: "/fragrances-makeup", label: "Fragrances and Make-up" },
    { href: "/gifts", label: "Gifts and Petit H" },
    { href: "/special-editions", label: "Special Editions and Services" },
    { href: "/about", label: "About BRAND" },
];

const serviceLinks = [
    { href: "/find-a-store", label: "Find a store", icon: <MapPin className="h-5 w-5 text-neutral-600" strokeWidth={1.5} /> },
    { href: "/account", label: "Account", icon: <User className="h-5 w-5 text-neutral-600" strokeWidth={1.5} /> },
    { href: "/contact-us", label: "Contact us", icon: <MessageSquare className="h-5 w-5 text-neutral-600" strokeWidth={1.5} /> },
];

const BrandLogo = () => (
    <svg viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg" className="w-28 md:w-36 h-auto">
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="serif" fontSize="24" fontWeight="bold">
            BRAND
        </text>
    </svg>
);

export const Navbar = () => {
    const scrollDirection = useScroll();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-[#fcf7f1] backdrop-blur-sm ">
            <div className="container mx-auto px-4">
                <div
                    className={cn(
                        "overflow-hidden transition-[height] duration-300",
                        scrollDirection === 'down' ? "h-0" : "h-24"
                    )}
                >
                    <div className="relative h-24">
                        <div className={cn("absolute inset-0 md:hidden px-4", isMobileSearchOpen ? "flex items-center" : "hidden")}>
                            <div className="flex items-center w-full px-4">
                                <Search className="h-5 w-5 text-neutral-500" />
                                <input type="search" placeholder="Search" autoFocus className="w-full h-full px-2 bg-transparent border-0 border-b-2 border-neutral-400 focus:ring-0 focus:outline-none focus:border-neutral-800" />
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                        </div>

                        <div className={cn("relative flex items-center justify-between h-full px-6", isMobileSearchOpen ? "hidden" : "flex")}>
                            <div className="flex items-center">
                                <div className="flex items-center gap-1 md:hidden">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-full sm:max-w-sm p-0 bg-[#fcf7f1]">
                                            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                                                <h2 className="text-lg font-medium">Menu</h2>
                                                <SheetClose asChild><Button variant="ghost" size="icon"><X className="h-6 w-6" /></Button></SheetClose>
                                            </div>
                                            <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
                                                <nav className="flex flex-col">
                                                    {navLinks.map((link) => (
                                                        <div key={link.href} className="flex justify-between items-center py-3 border-b border-neutral-200">
                                                            <NavLink to={link.href} className="text-sm uppercase tracking-wider text-neutral-800">{link.label}</NavLink>
                                                            <Button variant="ghost" size="icon" className="text-neutral-500"><Plus className="h-5 w-5" /></Button>
                                                        </div>
                                                    ))}
                                                </nav>
                                                <nav className="flex flex-col space-y-5 mt-10">
                                                    {serviceLinks.map((link) => (
                                                        <Link key={link.href} to={link.href} className="flex items-center gap-4 text-sm text-neutral-700 hover:text-neutral-900 transition-colors">{link.icon}<span>{link.label}</span></Link>
                                                    ))}
                                                </nav>
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                    <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(true)}>
                                        <Search className="h-6 w-6" strokeWidth={1.5} />
                                    </Button>
                                </div>
                                <div className="hidden md:flex relative items-center">
                                    <Search className="absolute left-0 h-5 w-5 text-muted-foreground" />
                                    <input type="search" placeholder="Search" className="w-full pl-7 border-0 border-b-2 border-neutral-300 rounded-none bg-transparent ring-0 shadow-none outline-none focus:ring-0 focus:outline-none focus:shadow-none focus:border-neutral-800" />
                                </div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Link to="/" aria-label="Back to homepage"><BrandLogo /></Link>
                            </div>

                            <div className="flex items-center gap-x-3">
                                <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"><User className="h-7 w-7" strokeWidth={1} /><span className="hidden md:inline text-sm">Account</span></Button>
                                <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"><ShoppingBag className="h-7 w-7" strokeWidth={1} /><span className="hidden md:inline text-sm">Cart</span></Button>
                            </div>
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
