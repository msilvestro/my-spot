import React, { useRef, FC, ReactNode } from "react"

type Props = {
  id: string
  children: ReactNode
  condition: boolean
}

const CollapsibleDiv: FC<Props> = ({ id, children, condition }: Props) => {
  const divRef = useRef<HTMLDivElement>(null)

  const getHeightStyle = () => {
    return condition && divRef.current
      ? { height: divRef.current.scrollHeight }
      : { height: 0 }
  }

  return (
    <div id={id} ref={divRef} style={getHeightStyle()}>
      {children}
    </div>
  )
}

export default CollapsibleDiv
