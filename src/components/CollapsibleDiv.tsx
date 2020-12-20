import React, { useRef, FC, ReactNode, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  condition: boolean
}

const CollapsibleDiv: FC<Props> = ({
  children,
  condition,
  ...otherProps
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null)

  const getHeightStyle = () => {
    return condition && divRef.current
      ? { height: divRef.current.scrollHeight }
      : { height: 0 }
  }

  return (
    <div ref={divRef} style={getHeightStyle()} {...otherProps}>
      {children}
    </div>
  )
}

export default CollapsibleDiv
