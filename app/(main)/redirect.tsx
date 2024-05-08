"use client"

import { headers } from 'next/headers';
import { redirect, usePathname, useRouter } from 'next/navigation';
import React from 'react'

export const Redirectt = () => {
    const path = usePathname();
    return redirect(!!path ? `/?redirect=${path}` : "/");
}
