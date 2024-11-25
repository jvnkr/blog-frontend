import HeaderElement from "@/components/HeaderElement";

// export const NGROK_URL = "https://9624-37-122-170-44.ngrok-free.app";
export const NGROK_URL = "http://localhost:8080";

export const Header = () => {
  return (
    <div
      style={{
        zIndex: 9999,
      }}
      className={
        "flex select-none items-center rounded-b-[15px] left-[50%] translate-x-[-50%] fixed top-0 border bg-zinc-900 bg-opacity-[0.7] border-[#272629] border-t-0 w-full max-w-[45rem] h-[60px] text-white text-md font-semibold backdrop-blur-sm"
      }
    >
      <HeaderElement
        className="rounded-br-[1px]"
        text={"For you"}
        selectedPath={"/home"}
      />
      <HeaderElement
        className="rounded-bl-[1px]"
        text={"Following"}
        selectedPath={"/following"}
      />
    </div>
  );
};
