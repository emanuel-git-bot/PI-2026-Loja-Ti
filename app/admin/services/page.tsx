"use client"

import { ServicesList } from "@/components/services-list"
import { Breadcrumb } from "@/components/breadcrumb"

export default function ServicesPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Serviços" }]} />
      <ServicesList />
    </div>
  )
}
