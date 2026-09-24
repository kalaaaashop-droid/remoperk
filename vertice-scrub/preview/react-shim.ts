// En la vista previa, React se carga desde cdnjs (window.React) en lugar de ir dentro del paquete.
const R = (window as unknown as { React: typeof import("react") }).React;
export const { useState, useReducer, useMemo, useEffect, Fragment, createElement } = R;
export default R;
