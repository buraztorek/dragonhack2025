using UnityEngine;

public class CameraFollow : MonoBehaviour
{
    [SerializeField]
    private Transform playerTransform;
    
    [SerializeField]
    private Vector3 offset = new Vector3(0f, 5f, -10f);
    [SerializeField]
    private float smoothSpeed = 0.125f;

    private Vector3 velocity = Vector3.zero;

    void LateUpdate()
    {
        if (playerTransform == null) return;

        Vector3 targetPosition = playerTransform.position + offset;
        transform.position = Vector3.SmoothDamp(transform.position, targetPosition, ref velocity, smoothSpeed);
        
        // Optional: lock rotation if needed explicitly
        // transform.rotation = Quaternion.Euler(20f, 0f, 0f); // Replace with your fixed rotation
    }
}