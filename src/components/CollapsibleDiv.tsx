import React, {
  useState,
  useRef,
  useEffect,
  FC,
  ReactNode,
  HTMLAttributes,
} from "react"

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
  const [height, setHeight] = useState(0)

  useEffect(() => {
    condition && divRef.current
      ? setHeight(divRef.current.scrollHeight)
      : setHeight(0)
  }, [divRef, condition])

  return (
    <div ref={divRef} style={{ height }} {...otherProps}>
      {children}
    </div>
  )
}

export default CollapsibleDiv
