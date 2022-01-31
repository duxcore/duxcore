// import Link from 'next/link'

// export default function NotFound() {
//   return (
//     <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
//       <h1 className="text-white text-9xl my-5">404</h1>
//       <div className="text-white opacity-30 my-5">
//         Oops, this page does not exist. <br />
//       </div>
//       <div>
//         <Link href="/">
//           <a className="text-blue-500 opacity-50 hover:opacity-75">Go home</a>
//         </Link>
//         {/* Snippet for adding more links. (e.g. blog, about, dashboard, etc.)
//         |
//         <Link href="/about">
//           <a className="text-blue-500 opacity-50 hover:opacity-75">Learn more</a>
//         </Link>
//         */}
//       </div>
//     </div>
//   );
// }

import Link from 'next/link'
import { DuxcoreIcon, SolidDiscord, SolidGitHub } from '../icons';

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-white text-9xl my-5">404</h1>
      <div className="text-white opacity-30 my-5">
        Oops, this page does not exist. <br />
      </div>
      <div>
        <Link href="/github">
          <SolidGitHub width="20" height="20" className="inline-block text-white opacity-30 hover:opacity-100 transition cursor-pointer mx-4"/>
        </Link>
        <Link href="/">
          <DuxcoreIcon width="20" height="20" className="inline-block text-white opacity-30 hover:opacity-100 transition cursor-pointer mx-4 -mt-1 ml-1 transform scale-50"/>
        </Link>
        <Link href="/discord">
          <SolidDiscord width="20" height="20" className="inline-block text-white opacity-30 hover:opacity-100 transition cursor-pointer mx-4"/>
        </Link>
      </div>
    </div>
  );
}
