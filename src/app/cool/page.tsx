import Image from "next/image";
import ayanSoccer from "@/images/ayan-soccer.jpg";
import fanduel from "@/images/fanduel.png";
import fcBarcelona from "@/images/fc-barcelona.svg.webp";
import messi from "@/images/messi.webp";
import onecommit from "@/images/onecommit.png";

export default function Kewl() {
  return (
    <div className="min-h-screen bg-gray-fill text-gray-text-dark flex items-center justify-center p-8">
      <div className="max-w-2xl flex flex-col items-center gap-6">
        <Image
          src={ayanSoccer}
          alt="Ayan playing soccer"
          width={250}
          height={250}
          className="rounded-lg object-cover"
        />

        <div className="flex gap-6">
          <Image
            src={messi}
            alt="Messi"
            width={120}
            height={120}
            className="rounded-lg object-cover"
          />
          <Image
            src={fcBarcelona}
            alt="FC Barcelona"
            width={140}
            height={120}
            className="rounded-lg"
          />
        </div>

        <p className="text-lg text-center">
          One cool thing about me is how big a role sports have played in my life. I have played soccer since I was 11 and captained my high school varsity team as a center back. I am also a huge fan of the game and have grown up watching everything from club soccer to major international tournaments such as the World Cup, Euros, and the Champions League. That passion has carried into my professional life as well, as it was a big reason I chose to intern at FanDuel, where I got to combine my interest in sports with software engineering. More recently, it motivated me to work with a sports recruiting startup out of Emory called OneCommit, where I lead engineering for an agentic copilot that helps high school athletes navigate the college recruiting process.
        </p>

        <div className="flex gap-6">
          <Image
            src={fanduel}
            alt="FanDuel"
            width={360}
            height={60}
            className="rounded-lg"
          />
          <Image
            src={onecommit}
            alt="OneCommit"
            width={120}
            height={120}
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}
