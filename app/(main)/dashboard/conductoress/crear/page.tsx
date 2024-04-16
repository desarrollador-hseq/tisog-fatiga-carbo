

import { CardPage } from '@/components/card-page'
import { TitleOnPage } from '@/components/title-on-page'
import React from 'react'
import { AddDriverForm } from '../_components/add-driver-form'


const bcrumb = [
  { label: "Conductores", path: "/dashboard/conductores" },
  { label: "Agregar", path: "/dashboard/crear" },
];

const CreateDriver = () => {
  return (
    <CardPage
     pageHeader={
      <TitleOnPage text={`Agregar conductor`} bcrumb={bcrumb} />
     }
    >
      {/* <AddDriverForm  /> */}
     create driver
    </CardPage>
  )
}

export default CreateDriver;
