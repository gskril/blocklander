export function FooterLink({
  children,
  ...props
}: React.HTMLProps<HTMLAnchorElement> & {
  children: React.ReactNode
}) {
  return (
    <a
      {...props}
      target="_blank"
      className="text-[#262626] hover:text-[#9b9ba6] transition-all duration-100"
    >
      {children}
    </a>
  )
}
