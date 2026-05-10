import type { SidebarSection } from '@/config/sidebar-items'

export function filterSidebarSections(
  sections: SidebarSection[],
  enabledModules: string[]
): SidebarSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.module || enabledModules.includes(item.module)
      ),
    }))
    .filter((section) => section.items.length > 0)
}
