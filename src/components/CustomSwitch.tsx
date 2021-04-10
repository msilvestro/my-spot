import React, { FC } from "react"

import Switch from "react-switch"

type Props = {
  checked: boolean
  onChange(checked: boolean): void
  title?: string
  description?: string
}

const CustomSwitch: FC<Props> = ({
  checked,
  onChange,
  title,
  description,
}: Props) => {
  return (
    <label
      style={{
        display: "inline-flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: "10px", textAlign: "start" }}>
        <b>{title}</b>
        <br />
        {description}
      </span>
      <Switch checked={checked} onChange={onChange} onColor="#e50914" />
    </label>
  )
}

export default CustomSwitch
