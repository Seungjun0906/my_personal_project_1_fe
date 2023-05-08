import { FunctionComponent, useMemo } from "react";
import { Button } from "@mui/base";

const Header: FunctionComponent = () => {
    const MENU_OBJECT_LIST = useMemo(() => {
        return [
            {
                title: "Menu",
                href: "/home",
            },
            {
                title: "Login",
                href: "/login",
            },
        ];
    }, []);

    return (
        <div className="w-full border-b-gray-500 border-b">
            {MENU_OBJECT_LIST.map((menuObject) => (
                <Button key={`${menuObject.title}`}>{menuObject.title}</Button>
            ))}
        </div>
    );
};

export default Header;
