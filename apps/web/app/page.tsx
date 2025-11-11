"use client"

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
  
  return (
    <div>
      <input 
        type="text" 
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room Id"
      />

      <button onClick={() => {
        router.push(`/room/${roomId}`)
      }}>
        Join_Room
      </button>
    </div>
  );
}