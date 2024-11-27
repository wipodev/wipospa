const directives = {
  if: /<([\w-]+)\s+[^>]*data-if="([^"]+)">([\s\S]*?)<\/\1>/g,
  else: /<([\w-]+)\s+[^>]*data-else="([^"]+)">([\s\S]*?)<\/\1>/g,
  elseif: /<([\w-]+)\s+[^>]*data-else-if="([^"]+)">([\s\S]*?)<\/\1>/g,
  for: /<([\w-]+)\s+[^>]*data-for="(\w+)\s+in\s+(\w+)"([^>]*)>([\s\S]*?)<\/\1>/g,
  each: /<([\w-]+)\s+[^>]*data-each="(\w+)\s+in\s+(\w+)"([^>]*)>([\s\S]*?)<\/\1>/g,
  show: /<([\w-]+)\s+[^>]*data-show="([^"]+)">([\s\S]*?)<\/\1>/g,
  hide: /<([\w-]+)\s+[^>]*data-hide="([^"]+)">([\s\S]*?)<\/\1>/g,
  on: /on(\w+)="(\w+)\((.*?)\)"/g,
};