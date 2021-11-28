import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "../../modules/auth/useAuth";
import { Button } from "../forms/Button";
import { Popover } from "@headlessui/react";
import {
  IoChevronDown,
  IoAlbums,
  IoPieChart,
  IoSettings,
  IoLogOut,
} from "react-icons/io5";
import { DropdownButton } from "../forms/DropdownButton";
interface AccountDropProps {}

export const AccountDrop: React.FC<AccountDropProps> = ({ children }) => {
  const { user, logOut } = useAuth();
  const [clicked, setClicked] = useState(false);

  return (
    <>
      <Button
        color={clicked ? "invisibleClicking" : "invisible"}
        className={"px-2 gap-1 relative"}
        clickHook={[clicked, setClicked, true]}
      >
        <Image
          src="https://plchldr.co/i/256x256?bg=fd4d4d"
          alt={`${user?.firstName}'s Profile Picture`}
          objectFit="cover"
          className="rounded-full"
          layout="fixed"
          height={"30rem"}
          width={"30rem"}
        ></Image>
        <span className="md:block hidden">{user?.firstName}</span>
        <IoChevronDown
          className={`transform transition-all ${clicked ? "rotate-180" : ""}`}
        />
      </Button>
      <div
        className={`bg-gray-800 rounded absolute top-8 min-w-15 right-0 shadow-lg transition-all overflow-hidden ${
          clicked ? "opacity-100" : "opacity-0"
        }`}
      >
        <DropdownButton href="/@me" icon={<IoAlbums className="inline" />}>
          Overview
        </DropdownButton>
        <DropdownButton onClick={logOut} icon={<IoLogOut className="inline" />}>
          Logout
        </DropdownButton>
      </div>
    </>
  );
};
