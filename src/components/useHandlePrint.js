import { useReactToPrint } from 'react-to-print';

const useHandlePrint = (ref) => {
  return useReactToPrint({
    content: () => ref.current,
  });
};

export default useHandlePrint;
