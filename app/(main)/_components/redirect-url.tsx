"use client"
 

import React from 'react'
import querystring from 'querystring';
import { redirect } from 'next/navigation';
import {useRouter} from 'next/navigation';


// export const RedirectUrl = () => {
//   const router = useRouter()

//   const handleRedirect = () => {
//     const lastSlashIndex = destination.lastIndexOf('/');
//     const message = destination.substring(lastSlashIndex + 1);
//     const url = `/?message=${message}`;
//     router.push(url);
//   };
//   return (
//     <div>redirect-url</div>
//   )
// }
