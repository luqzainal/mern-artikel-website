import { toast, Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const toastIcons = {
  success: <FiCheckCircle className="text-green-500" size={20} />,
  error: <FiXCircle className="text-red-500" size={20} />,
  warning: <FiAlertTriangle className="text-yellow-500" size={20} />,
  info: <FiInfo className="text-blue-500" size={20} />,
};

const showToast = (message: string, type: ToastType = 'info') => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {toastIcons[type]}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
};

export { Toaster, showToast };
