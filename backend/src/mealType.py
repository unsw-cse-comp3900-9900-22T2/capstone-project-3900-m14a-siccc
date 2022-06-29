"""
    Select the meal type.
"""

def getMealType(db, meal):
    """ Select the meal type

            Parameters:
                db : database
                meal: meal type
        
            Returns:
                info: list of all recipes ingredients
    """
    cur = db.cursor()
    qry = f"""
    select *
    from recipes
    where meal_type = {meal}
    """
    cur.execute(qry)
    info = cur.fetchall()
    cur.close()
    if not info:
        return None
    else:
        return info


