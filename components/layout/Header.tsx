import { FunctionComponent, useMemo } from "react";
import Link from "next/link";
import { Button } from "@mui/material";

const Header: FunctionComponent = () => {
    const MENU_OBJECT_LIST = useMemo(() => {
        return [
            {
                title: "Home",
                href: "/home",
            },
            {
                title: "Login",
                href: "/login",
            },
        ];
    }, []);

    return (
        <div className="w-full flex items-center gap-2 border-b-gray-500 border-b">
            {MENU_OBJECT_LIST.map((menuObject) => (
                <Button key={`${menuObject.title}`} variant="contained">
                    <Link href={menuObject.href}>{menuObject.title}</Link>
                </Button>
            ))}
        </div>
    );
};

export default Header;
