
import ProfileContent from './ProfileContent';
import Logout from './logout';

export default function Profile() {

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 space-y-8">
      
      {/* Pass points to the client component */}
      <ProfileContent />
      <Logout />
    </div>
  );
}

