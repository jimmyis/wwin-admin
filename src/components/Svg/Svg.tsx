import { SvgProps } from './types'

const Svg: React.FC = ({ children, ...props }) => {
  return <svg {...props}>{children}</svg>
}

Svg.defaultProps = {
  color: 'text',
  width: '20px',
  xmlns: 'http://www.w3.org/2000/svg',
}

export default Svg
