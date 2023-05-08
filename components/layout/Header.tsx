import { FunctionComponent, useMemo } from "react";
import { Button } from "@mui/base";
import Link from "next/link";

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
        <div className="w-full flex items-center gap-2 h-10 border-b-gray-500 border-b">
            {MENU_OBJECT_LIST.map((menuObject) => (
                <Link key={`${menuObject.title}`} href={menuObject.href}>
                    <Button>{menuObject.title}</Button>
                </Link>
            ))}
        </div>
    );
};

export default Header;
