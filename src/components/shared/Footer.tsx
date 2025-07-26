// src/components/shared/Footer.tsx
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

// Dữ liệu cho các mục trong footer
const footerSections = [
    {
        title: "SERVICES",
        links: ["Contact Us", "FAQ", "Find a Store", "Made to Measure"],
    },
    {
        title: "ORDERS",
        links: ["Payment", "Shipping", "Collect in Store", "Returns & Exchanges"],
    },
    {
        title: "LA MAISON HERMÈS",
        links: ["Sustainable Development", "The Hermès Foundation", "Join Us"],
    },
    {
        title: "LEGAL",
        links: ["Terms and Conditions", "Privacy Policy", "Cookie Policy"],
    },
];

export const Footer = () => {
    return (
        <footer className="bg-white text-neutral-800 border-t">
            <div className="container mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
                    {footerSections.map((section) => (
                        <Accordion key={section.title} type="single" collapsible className="w-full">
                            <AccordionItem value={section.title} className="border-b-0">
                                {/* THAY ĐỔI: Thêm `flex-none` và `gap-2` để chữ và icon gần nhau */}
                                <AccordionTrigger className="flex-none justify-start gap-2 text-sm uppercase tracking-widest hover:no-underline font-semibold py-2">
                                    {section.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 mt-4">
                                        {section.links.map((link) => (
                                            <li key={link}>
                                                <Link to="#" className="text-sm text-neutral-600 hover:text-neutral-900">
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </div>

                <div className="my-12 h-px w-full bg-neutral-200" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="md:text-left">
                        <h3 className="text-sm uppercase tracking-widest font-semibold">Customer Service</h3>
                        <div className="mt-4 text-sm text-neutral-600 space-y-2">
                            <p>Monday to Friday: 9am - 9pm EST</p>
                            <p>Saturday: 10am - 9pm EST</p>
                            <a href="tel:800-441-4488" className="block hover:text-neutral-900">800-441-4488</a>
                            <a href="mailto:service@brand.com" className="block underline hover:text-neutral-900">Email us</a>
                        </div>
                    </div>
                    <div className="md:text-center">
                        <h3 className="text-sm uppercase tracking-widest font-semibold">Newsletter</h3>
                        <p className="mt-4 text-sm text-neutral-600 max-w-xs mx-auto">
                            Receive our newsletter and discover our stories, collections, and surprises.
                        </p>
                        <Button variant="outline" className="mt-6 uppercase text-xs rounded-md tracking-widest px-8">
                            Subscribe
                        </Button>
                    </div>
                    <div className="md:text-right">
                        <h3 className="text-sm uppercase tracking-widest font-semibold">Follow Us</h3>
                        <div className="flex gap-4 mt-4 justify-center md:justify-end">
                            <Link to="#" aria-label="Facebook">
                                <Facebook className="h-5 w-5 text-neutral-600 hover:text-neutral-900" />
                            </Link>
                            <Link to="#" aria-label="Instagram">
                                <Instagram className="h-5 w-5 text-neutral-600 hover:text-neutral-900" />
                            </Link>
                            <Link to="#" aria-label="YouTube">
                                <Youtube className="h-5 w-5 text-neutral-600 hover:text-neutral-900" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="my-12 h-px w-full bg-neutral-200" />

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 text-center">
                    <p className="mb-4 md:mb-0">&copy; BRAND {new Date().getFullYear()}. All rights reserved.</p>
                    <Link to="#" className="uppercase tracking-widest hover:text-neutral-900">
                        Ship to : United States
                    </Link>
                </div>
            </div>
        </footer>
    );
};