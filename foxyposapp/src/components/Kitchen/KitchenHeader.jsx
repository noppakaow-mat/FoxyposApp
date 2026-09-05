export default function KitchenHeader({ count }) {
  return (
    <header className="mb-10 text-center">
      <p className="text-xs font-bold tracking-[0.35em] text-zinc-500">
        FOXY SHABU
      </p>

      <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
        KITCHEN DISPLAY
      </h1>

      <p className="mt-3 text-sm text-zinc-400">
        ออเดอร์ที่กำลังรอทำ {count} โต๊ะ
      </p>
    </header>
  );
}