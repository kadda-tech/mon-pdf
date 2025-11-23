import {SiteHeader} from "@/components/site-header"

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}
