// Default content. It shows until you save content from the owner panel (/admin.html).
const SITE = {
  projects: [
    {year:2021, name:"Example Project 2021", desc:"Short description of this project.", link:"", code:""},
    {year:2022, name:"Example Project 2022", desc:"Short description of this project.", link:"", code:""},
    {year:2023, name:"Example Project 2023", desc:"Short description of this project.", link:"", code:""}
  ],
  scripts: [
    {name:"Simple Movement", desc:"Basic WASD character movement.", link:"", code:
`using UnityEngine;

public class SimpleMovement : MonoBehaviour
{
    public float speed = 5f;

    void Update()
    {
        float x = Input.GetAxis("Horizontal");
        float z = Input.GetAxis("Vertical");
        transform.Translate(new Vector3(x, 0, z) * speed * Time.deltaTime);
    }
}`}
  ],
  packages: [
    {name:"Example Package", desc:"What this package contains.", link:"", code:""}
  ]
};
