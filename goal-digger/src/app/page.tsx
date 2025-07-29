
import Footer from "@/app/components/Footer";
import TaskManager from "./components/TaskManager";
import Header from "./components/Header"

export default function Home() {
  return ( 
    <div className="grid grid-rows-[10px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex flex-col gap-[24px] row-start-2 items-center w-full max-w-lg sm:items-start">
        <div className="text-center sm:text-center mx-auto">
          <h1 className="text-4xl font-bold">Goal Digger</h1>
          <p className="text-lg text-gray-500 mt-2">Your personal task manager</p>
        </div>
      
        <TaskManager />

      </main>
      
      <Footer />
    </div>
  );
}
