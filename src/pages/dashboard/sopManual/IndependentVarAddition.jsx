import React from 'react'

const IndependentVarAddition = () => {
  return (
    <>
     <section className="section">
     <h2 className="section-title">New Indpendent Variable Addition (Color, Brand, and Size) </h2>
     <p className="section-text">
        If the brand, size, or color you need is not available in the LOV when adding a new
        item in the Inventory Management System, you should contact the admin at your
        Regional Centre.
        <br />
        Here's what the admin needs to do:
        <ul className="detail-list">
            <li>
                Access the Admin System: The admin should log in to the admin system.
            </li>
            <li>
            Navigate to the Master Panel: In the Master Panel, there's an option called
            "Quick Code."
            </li>
            <li>
                Add New Independent Variable:

                <ul className="detail-list">
                    <li>
                        Click on "Quick Code."
                    </li>
                    <li>
                    In the "Add New Independent Variable" section, the admin can add the
                    new brand, size, or color in the respective description field.
                    </li>
                    <li>
                    There is no need to specify a value; leaving it blank is allowed as the
                    system will automatically accept its value.
                    </li>
                </ul>
            </li>
            <li>
            Submit the New Variable: After entering the new information, the admin
            should click on "Submit."
            </li>
            <li>
            Once submitted, the newly defined brand, size, or color will be reflected in the LOV,
            allowing you to select it when creating a new item code in the Item Master.
            </li>
        </ul>
     </p>
      </section>
    </>
  )
}

export default IndependentVarAddition
