import React, { FC } from "react"

const checkmarkIcon = (color?: string) => (
  <svg height="100%" width="100%" viewBox="-1.5 -6.5 17 21">
    <path
      d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0"
      fill={color || "#ffffff"}
      fillRule="evenodd"
    />
  </svg>
)

type Props = {
  name: "checkmark"
  color?: string
}

const Icon: FC<Props> = ({ name, color }: Props) => {
  return <>{name === "checkmark" && checkmarkIcon(color)}</>
}

export default Icon
