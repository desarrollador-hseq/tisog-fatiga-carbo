import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { TitleOnPage } from "@/components/title-on-page";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { ProfileForm } from "../../_components/profile-form";
import { NotAuthorized } from "@/components/not-authorized";

const crumbs = [{ label: "Perfil", path: "perfil" }];

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }
  
  const user = await db.user.findUnique({
      where: {
          id: session.user.id,
          active: true
        }
    })
    
    
    if (!user) {
      return <NotAuthorized />
    }


  return (
    <div>
      <TitleOnPage text="Datos de la empresa" bcrumb={crumbs} />

      <div>
        <ProfileForm user={user} />
      </div>

    </div>
  );
};

export default ProfilePage;