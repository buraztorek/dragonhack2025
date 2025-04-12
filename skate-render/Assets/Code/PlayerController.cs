using UnityEngine;
using Quaternion = UnityEngine.Quaternion;
using Vector3 = UnityEngine.Vector3;

public class PlayerController : MonoBehaviour
{
    [SerializeField]
    private Transform playerTransform;

    [SerializeField]
    private Vector3 updateRotation = new Vector3(0, 0.25f, 0);

    [SerializeField]
    private float speed = 0.2f;

    [SerializeField]
    private Animator animator;

    private void Start()
    {
        if (animator == null)
        {
            Debug.LogError("Animator is not assigned.");
        }
    }

        private void Update()
    {
        HandleInput();

        var newRotation = playerTransform.rotation.eulerAngles + updateRotation;
        playerTransform.rotation = Quaternion.Euler(newRotation);

        playerTransform.position += playerTransform.forward * (0.001f * speed);
    }

    private void HandleInput()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            if (animator != null)
            {
                animator.SetTrigger("PlayAnimation");
            }
        }
    }
}
