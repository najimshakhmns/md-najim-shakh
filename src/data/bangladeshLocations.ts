export interface DistrictData {
  district: string;
  districtBn: string;
  division: string;
  upazilas: { en: string; bn: string }[];
}

export const BANGLADESH_DISTRICTS: DistrictData[] = [
  {
    district: 'Gaibandha',
    districtBn: 'গাইবান্ধা',
    division: 'Rangpur',
    upazilas: [
      { en: 'Palashbari', bn: 'পলাশবাড়ী' },
      { en: 'Gaibandha Sadar', bn: 'গাইবান্ধা সদর' },
      { en: 'Gobindaganj', bn: 'গোবিন্দগঞ্জ' },
      { en: 'Sadullapur', bn: 'সাদুল্লাপুর' },
      { en: 'Sundarganj', bn: 'সুন্দরগঞ্জ' },
      { en: 'Saghata', bn: 'সাঘাটা' },
      { en: 'Phulchhari', bn: 'ফুলছড়ি' },
    ],
  },
  {
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    division: 'Dhaka',
    upazilas: [
      { en: 'Dhanmondi', bn: 'ধানমন্ডি' },
      { en: 'Gulshan', bn: 'গুলশান' },
      { en: 'Banani', bn: 'বনানী' },
      { en: 'Uttara', bn: 'উত্তরা' },
      { en: 'Mirpur', bn: 'মিরপুর' },
      { en: 'Mohammadpur', bn: 'মোহাম্মদপুর' },
      { en: 'Motijheel', bn: 'মতিঝিল' },
      { en: 'Tejgaon', bn: 'তেজগাঁও' },
      { en: 'Badda', bn: 'বাড্ডা' },
      { en: 'Savar', bn: 'সাভার' },
      { en: 'Keraniganj', bn: 'কেরানীগঞ্জ' },
      { en: 'Dhamrai', bn: 'ধামরাই' },
    ],
  },
  {
    district: 'Chittagong',
    districtBn: 'চট্টগ্রাম',
    division: 'Chittagong',
    upazilas: [
      { en: 'Panchlaish', bn: 'পাঁচলাইশ' },
      { en: 'Kotwali', bn: 'কোতোয়ালী' },
      { en: 'Agrabad', bn: 'আগ্রাবাদ' },
      { en: 'Halishahar', bn: 'হালিশহর' },
      { en: 'Hathazari', bn: 'হাটহাজারী' },
      { en: 'Sitakunda', bn: 'সীতাকুণ্ড' },
      { en: 'Patiya', bn: 'পটিয়া' },
      { en: 'Raozan', bn: 'রাউজান' },
    ],
  },
  {
    district: 'Bogura',
    districtBn: 'বগুড়া',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Bogura Sadar', bn: 'বগুড়া সদর' },
      { en: 'Sherpur', bn: 'শেরপুর' },
      { en: 'Shibganj', bn: 'শিবগঞ্জ' },
      { en: 'Gabtali', bn: 'গাবতলী' },
      { en: 'Sonatola', bn: 'সোনাতলা' },
      { en: 'Dhunat', bn: 'ধুনট' },
    ],
  },
  {
    district: 'Rangpur',
    districtBn: 'রংপুর',
    division: 'Rangpur',
    upazilas: [
      { en: 'Rangpur Sadar', bn: 'রংপুর সদর' },
      { en: 'Mithapukur', bn: 'মিঠাপুকুর' },
      { en: 'Pirganj', bn: 'পীরগঞ্জ' },
      { en: 'Badarganj', bn: 'বদরগঞ্জ' },
      { en: 'Kaunia', bn: 'কাউনিয়া' },
      { en: 'Gangachara', bn: 'গঙ্গাচড়া' },
    ],
  },
  {
    district: 'Sylhet',
    districtBn: 'সিলেট',
    division: 'Sylhet',
    upazilas: [
      { en: 'Sylhet Sadar', bn: 'সিলেট সদর' },
      { en: 'Beanibazar', bn: 'বিয়ানীবাজার' },
      { en: 'Golapganj', bn: 'গোলাপগঞ্জ' },
      { en: 'Gowainghat', bn: 'গোয়াইনঘাট' },
      { en: 'Zakiganj', bn: 'জকিগঞ্জ' },
    ],
  },
  {
    district: 'Rajshahi',
    districtBn: 'রাজশাহী',
    division: 'Rajshahi',
    upazilas: [
      { en: 'Boalia', bn: 'বোয়ালিয়া' },
      { en: 'Motihar', bn: 'মতিহার' },
      { en: 'Paba', bn: 'পবা' },
      { en: 'Godagari', bn: 'গোদাগাড়ী' },
      { en: 'Tanore', bn: 'তানোর' },
      { en: 'Bagha', bn: 'বাঘা' },
    ],
  },
  {
    district: 'Khulna',
    districtBn: 'খুলনা',
    division: 'Khulna',
    upazilas: [
      { en: 'Khulna Sadar', bn: 'খুলনা সদর' },
      { en: 'Sonadanga', bn: 'সোনাডাঙ্গা' },
      { en: 'Khalishpur', bn: 'খালিশপুর' },
      { en: 'Dumuria', bn: 'ডুমুরিয়া' },
      { en: 'Rupsha', bn: 'রূপসা' },
    ],
  },
  {
    district: 'Barishal',
    districtBn: 'বরিশাল',
    division: 'Barishal',
    upazilas: [
      { en: 'Barishal Sadar', bn: 'বরিশাল সদর' },
      { en: 'Babuganj', bn: 'বাবুগঞ্জ' },
      { en: 'Bakerganj', bn: 'বাকেরগঞ্জ' },
      { en: 'Gournadi', bn: 'গৌরনদী' },
    ],
  },
  {
    district: 'Mymensingh',
    districtBn: 'ময়মনসিংহ',
    division: 'Mymensingh',
    upazilas: [
      { en: 'Mymensingh Sadar', bn: 'ময়মনসিংহ সদর' },
      { en: 'Muktagacha', bn: 'মুক্তাগাছা' },
      { en: 'Trishal', bn: 'ত্রিশাল' },
      { en: 'Bhaluka', bn: 'ভালুকা' },
      { en: 'Fulbaria', bn: 'ফুলবাড়ীয়া' },
    ],
  },
];
