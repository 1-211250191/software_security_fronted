export function getSourceName(source: string) {
  // source is an url string, e.g. "https://avd.aliyun.com/avd/detail/12345"
  // return "阿里云"
  if (source.includes("avd.aliyun.com")) {
    return "阿里云"
  }
  if (source.includes("nvd.nist.gov")){
    return "NVD"
  }
  if (source.includes("github.com")){
    return "Github"
  }
}

export function getSourceIcon(source: string) {
  if (source.includes("avd.aliyun.com")) {
    return "avd.ico"
  }
  if (source.includes("nvd.nist.gov")){
    return "nvd.ico"
  }
  if (source.includes("github.com")){
    return "github.png"
  }
}
