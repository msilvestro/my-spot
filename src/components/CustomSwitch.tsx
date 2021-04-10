import React, { FC } from "react"

import Switch from "react-switch"

type Props = {
  checked: boolean
  onChange(checked: boolean): void
  label?: string
}

const CustomSwitch: FC<Props> = ({ checked, onChange, label }: Props) => {
  return (
    <label
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Switch checked={checked} onChange={onChange} onColor="#e50914" />
      <span style={{ marginLeft: "10px" }}>{label}</span>
    </label>
  )
}

export default CustomSwitch
