import Image from "next/image";

export default function Footer() {
    return (
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/unsafest/ToDo"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repo
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/unsafest/ToDo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="rounded-full"
            aria-hidden
            src="/grim-repo.jpg"
            alt="Grim repo octocat icon"
            width={75}
            height={75}
          />
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/unsafest/"
          target="_blank"
          rel="noopener noreferrer"
        >
          /unsafest
        </a>
      </footer>
    );
}