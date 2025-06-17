"use client"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

const PageProgressBar = () => {
  return (
    <ProgressBar
      height="4px"
      color="#f97316" // Orange-500, matching your theme
      options={{ showSpinner: false }}
      shallowRouting
    />
  )
}

export default PageProgressBar
