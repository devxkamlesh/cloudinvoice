"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintInvoice() { return <Button variant="outline" className="no-print" onClick={() => window.print()}><Printer className="size-4" />Export PDF</Button>; }
