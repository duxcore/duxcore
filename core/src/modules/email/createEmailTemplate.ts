interface PropTypes {
  [propName: string]: any
}

type TemplateMethod<P> = (props: P) => string;

export function createEmailTemplate<P extends PropTypes>(templateMethod: TemplateMethod<P>): TemplateMethod<P> {
  return templateMethod;
}