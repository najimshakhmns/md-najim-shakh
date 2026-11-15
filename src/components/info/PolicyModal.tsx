import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export type PolicyType = 'shipping' | 'returns' | 'privacy' | 'terms' | 'about';

interface PolicyModalProps {
  isOpen: boolean;
  type: PolicyType;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  const { settings } = useSettings();

  const getPolicyDetails = () => {
    switch (type) {
      case 'about':
        return {
          title: `About ${settings.companyName}`,
          icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />,
          content: (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <p className="font-semibold text-zinc-900 text-sm">
                "Your Style, Your Identity."
              </p>
              <p>
                <strong>{settings.companyName}</strong> was founded by{' '}
                <strong>{settings.founderName}</strong> in <strong>{settings.businessAddress}</strong>{' '}
                with a vision to create an international-standard luxury fashion destination for
                Bangladesh.
              </p>
              <p>
                From bespoke royal Panjabis featuring pure gold zari embroidery to heavyweight 450 GSM
                streetwear hoodies and Egyptian cotton executive shirts, every garment is crafted
                with uncompromising attention to detail, fabric feel, and structured silhouettes.
              </p>
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                <p className="font-bold text-zinc-900">Headquarters & Manufacturing:</p>
                <p>Palashbari, Gaibandha, Rangpur Division, Bangladesh</p>
                <p>
                  <strong>Helpline / WhatsApp:</strong> {settings.contactNumber}
                </p>
                <p>
                  <strong>Customer Care:</strong> {settings.emailAddress}
                </p>
              </div>
            </div>
          ),
        };
      case 'shipping':
        return {
          title: 'Shipping & Delivery Policy',
          icon: <Truck className="w-5 h-5 text-[#D4AF37]" />,
          content: (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <p>{settings.policies.shipping}</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-zinc-200">
                  <thead className="bg-zinc-100 font-bold text-zinc-900">
                    <tr>
                      <th className="p-2.5 border border-zinc-200">Destination</th>
                      <th className="p-2.5 border border-zinc-200">Estimated Transit</th>
                      <th className="p-2.5 border border-zinc-200">Courier Charge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 font-mono">
                    <tr>
                      <td className="p-2.5 border border-zinc-200 font-sans">Inside Dhaka Metro</td>
                      <td className="p-2.5 border border-zinc-200">24 – 48 Hours</td>
                      <td className="p-2.5 border border-zinc-200 font-bold">
                        ৳{settings.deliveryCharges.insideDhaka} (Free over ৳
                        {settings.deliveryCharges.freeShippingThreshold})
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-zinc-200 font-sans">
                        Gaibandha, Rangpur & North Bengal
                      </td>
                      <td className="p-2.5 border border-zinc-200">24 – 48 Hours</td>
                      <td className="p-2.5 border border-zinc-200 font-bold">
                        ৳{settings.deliveryCharges.outsideDhaka} (Free over ৳
                        {settings.deliveryCharges.freeShippingThreshold})
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-zinc-200 font-sans">
                        All Other 62 Bangladesh Districts
                      </td>
                      <td className="p-2.5 border border-zinc-200">2 – 4 Business Days</td>
                      <td className="p-2.5 border border-zinc-200 font-bold">
                        ৳{settings.deliveryCharges.outsideDhaka} (Free over ৳
                        {settings.deliveryCharges.freeShippingThreshold})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ),
        };
      case 'returns':
        return {
          title: '7-Day Return & Exchange Policy',
          icon: <RotateCcw className="w-5 h-5 text-[#D4AF37]" />,
          content: (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <p>{settings.policies.returns}</p>
              <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                <li>Items must be unworn, unwashed, and with all original brand tags attached.</li>
                <li>Size exchanges are processed within 48 hours upon receipt at our Palashbari facility.</li>
                <li>Cash on Delivery orders can be checked with the courier before acceptance.</li>
              </ul>
            </div>
          ),
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <FileText className="w-5 h-5 text-[#D4AF37]" />,
          content: (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <p>{settings.policies.privacy}</p>
              <p>
                We collect your name, phone number, and address strictly for logistics and delivery
                fulfillment. Payment details (bKash/Nagad/Rocket TrxID) are processed securely on the
                backend and are never shared.
              </p>
            </div>
          ),
        };
      case 'terms':
      default:
        return {
          title: 'Terms & Conditions',
          icon: <FileText className="w-5 h-5 text-[#D4AF37]" />,
          content: (
            <div className="space-y-4 text-xs text-zinc-700 leading-relaxed">
              <p>{settings.policies.terms}</p>
              <p>
                MNS Fashion Brand reserves the right to modify prices, discontinue limited collections,
                or cancel orders suspected of fraudulent activity.
              </p>
            </div>
          ),
        };
    }
  };

  const details = getPolicyDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            {details.icon}
            <h3 className="font-serif text-base font-bold">{details.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">{details.content}</div>

        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#111111] text-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
